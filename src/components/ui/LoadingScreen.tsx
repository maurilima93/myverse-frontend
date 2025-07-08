import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Carregando...', 
  fullScreen = true 
}) => {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-background z-50 myverse-flex-center'
    : 'myverse-flex-center py-12';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Logo/Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 myverse-gradient rounded-full myverse-flex-center mx-auto">
            <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="myverse-heading-4 mb-2">MyVerse</h2>
        <p className="myverse-body text-muted-foreground">{message}</p>

        {/* Loading Animation */}
        <div className="mt-6 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

