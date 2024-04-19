import { InputHTMLAttributes, forwardRef } from "react";
import Datepicker from "react-tailwindcss-datepicker";

interface FormDateProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const FormDate = forwardRef<HTMLInputElement, FormDateProps>(
  ({ label, helperText, error, className, ...props }, ref) => (
    <div className={`${className} flex flex-col gap-1 mb-2`}>
      <label className="font-semibold text-slate-800" htmlFor={props.id}>
        {label}
      </label>
      <Datepicker
        {...props}
        // ref={ref}
        asSingle
        value={{
          startDate: new Date(props.value as string),
          endDate: null,
        }}
        onChange={(value) => {}}
        inputClassName=""
        containerClassName=""
        toggleClassName=""
      />
      <p
        id={`${props.id}-input-helper-text`}
        className={`
          text-xs h-3
          ${error ? "text-red-600" : "text-slate-600"}
        `}
      >
        {helperText ?? error}
      </p>
    </div>
  )
);

FormDate.displayName = "FormDate";