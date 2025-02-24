import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormInputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
}

const FormInputField = <T extends FieldValues>({
  control,
  name,
  label,
  type,
  placeholder,
}: FormInputFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-0">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white outline-none transition-all duration-100"
              autoComplete="off"
              {...field}
              required
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInputField;
