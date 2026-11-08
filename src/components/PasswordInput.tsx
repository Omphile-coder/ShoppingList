import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

// Adds a visibility toggle without changing how the form reads the password.
export function PasswordInput(props: ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <input {...props} type={visible ? "text" : "password"} className="auth-input" />
      <button type="button" className="icon-button" onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}>
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
