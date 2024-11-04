const InfoBox = ({ title, value, description }) => {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
      <p className="text-lg font-semibold text-gray-800">{title}</p>
      <p className="text-blue-500 font-bold mt-2 break-all overflow-hidden text-ellipsis">
        {value}
      </p>
      <p className="text-gray-600 mt-4 text-xs md:text-sm">{description}</p>
    </div>
  );
};

export default InfoBox;
