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
        // mapping (address => bool) approvals; // Mapping is a reference type
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    // address payable[] public approvers; 
    mapping (address => bool) public approvers;
    mapping(uint => mapping(address => bool)) public approvals; // Mapping to track approvals for each request
    uint public approversCount;

    // constructor(uint minimum, address creator) payable {
    //     manager = creator;
    //     minimumContribution = minimum;
    // }

    // There is no need to called it payable because it is not receiving ether 
    // It is just initializing the contract
    constructor(uint minimum, address creator) payable{
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted(){
        require(msg.sender == manager, "Only manager can create request");
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Contribution must be greater than minimum amount.");

        // approvers.push(payable (msg.sender));
        // approvers[msg.sender] = true;
        // approversCount++;
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(string memory description, uint value, address payable recipient)
     public {
        // require(approvers[msg.sender],  "Sender is not an approver");
        // This is require statement is not needed as we have restricted modifier which already checks for the manager


        Request memory newRequest = Request({
            description : description,
            value : value,
            recipient : recipient,
            complete: false,
            approvalCount : 0
        });

    //     requests.push(); // Push a new empty Request struct to the array
    // uint index = requests.length - 1; // Get the index of the new Request struct

    //     Request storage newRequest = requests[index];
    //     newRequest.description = description;
    //     newRequest.value = value;
    //     newRequest.recipient = recipient;
    //     newRequest.complete = false;
    //     newRequest.approvalCount = 0;

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {

        Request storage request = requests[index];

        require(approvers[msg.sender], "Only contributors can approve.");
        // require(!request.approvals[msg.sender], "You have already approved this request."); // Allows only who don't voted before
        require(!approvals[index][msg.sender], "You have already approved this request."); // Allows only those who haven't voted before
        // request.approvals[msg.sender] = true;
        approvals[index][msg.sender] = true; 
        request.approvalCount++;
    }


    function finalizeRequest(uint index) public restricted {

        Request storage request = requests[index];
        require(address(this).balance >= request.value, "Insufficient contract balance.");

        require(request.approvalCount > (approversCount / 2), "Not enough approvals.");
        require(!request.complete, "Request is already complete.");

        request.recipient.transfer(request.value);
        request.complete = true;

    }

     function getRequestsCount() public view returns (uint) {
    return requests.length;
}

// function getRequest(uint index)
//     public
//     view
//     returns (string memory description, uint value, address recipient, bool complete, uint approvalCount) 
// {
//     require(index < requests.length, "Invalid request index.");
//     Request memory request = requests[index];

//     return (
//         request.description,
//         request.value,
//         request.recipient,
//         request.complete,
//         request.approvalCount
//     );
// }
// function getRequestByIndex(uint index) public view returns (string memory description) {
//     require(index < requests.length, "Invalid request index.");
    
//     Request memory request = requests[index];

//     return request.description;
// }

function getRequestByIndex(uint index) public view returns ( uint value, address recipient, bool complete, uint approvalCount) {
    require(index < requests.length, "Invalid request index.");
    
    Request memory request = requests[index];
     

    return (request.value, request.recipient, request.complete, request.approvalCount);
}
}