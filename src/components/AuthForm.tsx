import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { LoadingSpinner } from "./ui/LoadingSpinner";

export interface AuthFormProps {
    onSubmit: (data: Record<string, string>) => Promise<void> | void;
    loading?: boolean;
    submitText?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    name?: string;
    defaultValue?: string; // Add defaultValue prop
}

export function AuthForm({
    onSubmit,
    loading,
    submitText = "Next",
    label = "Email",
    placeholder = "Email",
    type = "email",
    name = "email",
    defaultValue // Add defaultValue to destructure
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
                    autoComplete={type}
                    defaultValue={defaultValue} // Set defaultValue for input
                    {...register(name, { required: `${label} is required` })}
                    aria-invalid={!!errors[ name ]}
                    disabled={loading}
                />
                {errors[ name ] && (
                    <p className="text-destructive text-xs mt-1">{errors[ name ]?.message as string}</p>
                )}
            </div>
            <Button type="submit" className="w-full flex items-center justify-center" disabled={loading}>
                {loading ? <LoadingSpinner className="text-white" /> : submitText}
            </Button>
        </form>
    );
} 