import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib";
import { useNavigate } from "react-router-dom";
import { onError } from "../lib/errorLib";
import { useFormFields } from "../lib/hooksLib";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      nav("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Stack gap={3}>
          <Form.Control
            autoFocus
            size="lg"
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
          <Form.Control
            size="lg"
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
          <LoaderButton
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Login
          </LoaderButton>
        </Stack>
      </Form>
    </div>
  );
}
