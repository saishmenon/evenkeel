import { useState } from 'react';
import { TextField, type TextFieldProps } from '../../components/TextField/TextField';
import { IconButton } from '../../components/IconButton/IconButton';

/** A password field with a show/hide button (uses Text field's suffix slot). */
export function PasswordField(props: Omit<TextFieldProps, 'type' | 'suffix'>) {
  const [show, setShow] = useState(false);
  return <TextField {...props} type={show ? 'text' : 'password'} autoComplete={props.autoComplete ?? 'current-password'}
    suffix={<IconButton icon={show ? 'eye-off' : 'eye'} label={show ? 'Hide password' : 'Show password'} size="sm" onClick={() => setShow(!show)} style={{ marginRight: -8 }} />} />;
}
