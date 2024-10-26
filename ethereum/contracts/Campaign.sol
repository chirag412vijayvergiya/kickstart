pragma solidity 0.8.28;

contract CampaignFactory {
    address [] public deployedCampaigns;

    function createCampaign(uint minimum) public  { 
           address newCampaign =  address(new Campaign(minimum, msg.sender));
           deployedCampaigns.push(newCampaign);
    }

     function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

}


contract Campaign {
    // This struct will not create an instance of a request
    // When we place a struct definition, we are introducing a brand new type into our contract. 
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping (address => bool) approvals; // Mapping is a reference type
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    // address payable[] public approvers; 
    mapping (address => bool) public approvers;
    uint public approversCount;

    constructor(uint minimum, address creator) payable {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        // approvers.push(payable (msg.sender));
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient)
     public restricted {
        require(approvers[msg.sender]);
        // Request storage newRequest = Request({
        //     description : description,
        //     value : value,
        //     recipient : recipient,
        //     complete: false,
        //     approvalCount : 0,
        // });

        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        // requests.push(newRequest);
    }

    function approveRequest(uint index) public {

        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]); // Allows only who don't voted before

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }


    function finalizeRequest(uint index) public restricted {

        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;

    }
}