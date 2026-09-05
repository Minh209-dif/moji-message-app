import type { User } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Heart } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

type EditableUserInfo = {
    key: keyof Pick<User, "displayName" | "username" | "email" | "phone">;
    label: string;
    type?: string;
};

const PERSONAL_FIELDS: EditableUserInfo[] = [
    {key: "displayName", label: "Display Name"},
    {key: "username", label: "Username"},
    {key: "email", label: "Email"},
    {key: "phone", label: "Phone"},
];

type Props = {
    userInfo: User | null;
}


const PersonalInfoForm = ({userInfo}: Props) => {
    if(!userInfo) return;
    
    return (
        <Card className="glass-strong border-border/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="size-5 text-primary"/>
                    Personal Information
                </CardTitle>
                <CardDescription>
                    Update your personal information below.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PERSONAL_FIELDS.map(({key, label, type}) => (
                        <div key={key} className="space-y-2">
                            <Label htmlFor={key}>
                                {label}
                            </Label>
                            <Input
                                id={key}
                                type={type || "text"}
                                defaultValue={userInfo[key] ?? ""}
                                className="glass-light border-border/30"
                            />
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio"
                    rows={3}
                    value={userInfo.bio ?? ""}
                    className="glass-light border-border/30 resize-none"
                    />
                </div>

                <div className="flex justify-end">
                    <Button className="w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-opacity">
                        Save changes
                    </Button>
                </div>
            </CardContent>

        </Card>
    )
};

export default PersonalInfoForm;