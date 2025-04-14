"use client"

import { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Container, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import Link from "next/link";

const useSignupButtonState = () => {
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const { values } = useFormikContext<{ name: string; email: string; password: string }>();
  
    useEffect(() => {
      setButtonDisabled(!(values.email && values.password && values.name));
    }, [values]);
  
    return buttonDisabled;
}

const SignupButton = ({ isSubmitting, loading }: { isSubmitting: boolean; loading: boolean }) => {
    const buttonDisabled = useSignupButtonState();
  
    return (
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={buttonDisabled || isSubmitting || loading}>
            {loading ? "Signing Up..." : "Sign Up"}
        </Button>
    )
}

const Signup = () => {
    const router = useRouter()

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    })

    const [loading, setLoading] = useState(false)
	const [passwordVisible, setPasswordVisible] = useState(false)

    const onSignup = async (values: { name: string; email: string; password: string }, { setSubmitting, resetForm }: any) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", values);
            console.log("Signup Response", response.data);
            toast.success("Sign Up Successful!");

            resetForm()
            router.push("/login")
        } catch (err: unknown) {
            console.log("Sign Up Failed!", err);
            toast.error("Sign Up Failed!");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, p: 4, boxShadow: 3, borderRadius: 2, background: "aliceblue" }}>
                <Typography variant="h5" mb={2} textAlign="center" color="black">
                    Sign Up {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                </Typography>

                <Formik
                    initialValues={{ name: "", email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={onSignup}
                >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Field
                            as={TextField}
                            fullWidth
                            label="Name"
                            name="name"
                            variant="outlined"
                            margin="normal"
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                        />
                    
                        <Field
                            as={TextField}
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />

                        <Field
                            as={TextField}
                            fullWidth
                            label="Password"
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            variant="outlined"
                            margin="normal"
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setPasswordVisible(!passwordVisible)} edge="end">
											{passwordVisible ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								),
							  }}
                        />

                        <SignupButton isSubmitting={isSubmitting} loading={loading} />
                    </Form>
                )}
                </Formik>

                <Link href="/login" passHref>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                        Already have an account? Sign in
                    </Typography>
                </Link>

                <Link href={"/login"} passHref>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                        Forgot your password?
                    </Typography>
                </Link>
            </Box>
        </Container>
    );
};

export default Signup;
