import { LoaderCircle } from 'lucide-react';

function LoadingState() {
  return (
    <div className="loading-state">
      <LoaderCircle size={24} className="spin" />
      <span>Generating routes...</span>
    </div>
  );
}

export default LoadingState;
