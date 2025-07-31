import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { ErrorMessage } from "./ui/ErrorMessage";

export interface AuthFormProps {
    onSubmit: (data: Record<string, string>) => Promise<void> | void;
    loading?: boolean;
    submitText?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    name?: string;
    defaultValue?: string;
}

export function AuthForm({
    onSubmit,
    loading,
    submitText = "Next",
    label = "Email",
    placeholder = "Email",
    type = "email",
    name = "email",
    defaultValue
}: AuthFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<Record<string, string>>();

    return (
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <Label htmlFor={name} className="mb-2">{label}</Label>
                <Input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    autoFocus={true}
                    autoComplete={type}
                    defaultValue={defaultValue}
                    {...register(name, { required: `${label} is required` })}
                    aria-invalid={!!errors[ name ]}
                    disabled={loading}
                />
                <ErrorMessage message={errors[ name ]?.message as string} />
            </div>
            <Button type="submit" className="w-full flex items-center justify-center" disabled={loading}>
                {loading ? <LoadingSpinner /> : submitText}
            </Button>
        </form>
    );
} 