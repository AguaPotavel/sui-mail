interface FetchEmailsButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const FetchEmailsButton = ({ onClick, loading }: FetchEmailsButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Refresh Emails'}
    </button>
  );
};
