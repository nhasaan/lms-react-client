import { useField } from 'formik';
import React from 'react';
import { Form, Label, Radio } from 'semantic-ui-react';

interface Props {
    name: string;
    label?: string;
    value: string;
    checked: boolean;
}

export default function MyRadioInput(props: Props) {
    const [field, meta] = useField(props.name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Radio {...field} {...props}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}