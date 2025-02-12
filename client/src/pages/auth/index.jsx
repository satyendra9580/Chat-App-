import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

export default function Auth() {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        return true;
    };

    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password should be the same");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (validateLogin()) {
            const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
            if (response.data.user.id) {
                setUserInfo(response.data.user);
                if (response.data.user.profileSetup) navigate("/chat");
                else navigate("/profile");
            }
            console.log({ response });
        }
    };

    const handleSignup = async () => {
        if (validateSignup()) {
            const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
            if (response.status === 201) {
                setUserInfo(response.data.user);
                navigate("/profile");
            }
            console.log({ response });
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center p-4">
            <div className="bg-white shadow-lg border rounded-3xl w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] flex flex-col xl:grid xl:grid-cols-2">
                {/* Left Side */}
                <div className="flex flex-col gap-6 items-center justify-center p-6 md:p-10 w-full">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <h1 className="text-4xl md:text-5xl font-bold">Welcome</h1>
                            <img src={Victory} className="h-[80px] md:h-[100px]" alt="Victory Icon" />
                        </div>
                        <p className="font-medium text-gray-600">Fill in the details to get started with the best chat app</p>
                    </div>
                    
                    {/* Tabs Section */}
                    <div className="w-full flex justify-center">
                        <Tabs className="w-full max-w-md" defaultValue="login">
                            <TabsList className="flex justify-between bg-transparent border-b w-full">
                                <TabsTrigger value="login" className="w-full text-black border-b-2 p-3 transition-all duration-300 data-[state=active]:font-semibold data-[state=active]:border-purple-500">
                                    Login
                                </TabsTrigger>
                                <TabsTrigger value="signup" className="w-full text-black border-b-2 p-3 transition-all duration-300 data-[state=active]:font-semibold data-[state=active]:border-purple-500">
                                    Signup
                                </TabsTrigger>
                            </TabsList>

                            {/* Login Form */}
                            <TabsContent value="login" className="flex flex-col gap-4 mt-4">
                                <Input 
                                    placeholder="Email" 
                                    type="email" 
                                    className="rounded-lg p-4" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input 
                                    placeholder="Password" 
                                    type="password" 
                                    className="rounded-lg p-4" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button onClick={handleLogin} className="rounded-lg p-4">Login</Button>
                            </TabsContent>

                            {/* Signup Form */}
                            <TabsContent value="signup" className="flex flex-col gap-4 mt-4">
                                <Input 
                                    placeholder="Email" 
                                    type="email" 
                                    className="rounded-lg p-4" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input 
                                    placeholder="Password" 
                                    type="password" 
                                    className="rounded-lg p-4" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Input 
                                    placeholder="Confirm Password" 
                                    type="password" 
                                    className="rounded-lg p-4" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Button onClick={handleSignup} className="rounded-lg p-4">Signup</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Right Side (Image Section) - Visible only on xl screens */}
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} className="h-[400px] w-auto xl:h-[600px]" alt="Background" />
                </div>
            </div>
        </div>
    );
}
