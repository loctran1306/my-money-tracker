import { Check, Info, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface CustomAlertProps {
  title?: string;
  type?: 'error' | 'warning' | 'success';
}

const CustomAlert = ({
  title = 'Thành công',
  type = 'success',
}: CustomAlertProps) => {
  const icon = {
    error: <X className="h-4 w-4 text-red-500" />,
    warning: <Info className="h-4 w-4 text-yellow-600" />,
    success: <Check className="h-4 w-4 text-green-500" />,
  };
  const color = {
    error: 'border-red-400 bg-red-50',
    warning: 'border-yellow-700 bg-yellow-100',
    success: 'border-green-600 bg-green-100',
  };
  const textColor = {
    error: 'text-red-700',
    warning: 'text-yellow-700',
    success: 'text-green-700',
  };
  return (
    <Alert className={`grid w-full max-w-xl items-start ${color[type]}`}>
      <AlertDescription className="flex items-center gap-2">
        {icon[type]}
        <AlertTitle className={`${textColor[type]} flex items-center gap-2`}>
          {title}
        </AlertTitle>
      </AlertDescription>
    </Alert>
  );
};

export default CustomAlert;
