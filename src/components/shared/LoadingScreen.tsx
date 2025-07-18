type LoadingScreenProps = {
  message?: string;
};

const LoadingScreen = ({ message }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        {message && (
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
