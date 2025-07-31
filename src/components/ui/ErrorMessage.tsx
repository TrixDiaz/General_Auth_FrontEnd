interface FormErrorMessageProps {
  message?: string;
}

export function ErrorMessage({ message }: FormErrorMessageProps) {
  if (!message) return null;

  return <p className="text-destructive text-xs mt-1">{message}</p>;
}