import { Bell, Shield, ShieldBan } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";


const PrivacySettings = () => (
    <Card className="glass-strong border-border/30">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary"/>
                Privacy & security
            </CardTitle>
            <CardDescription>
                Manage account's privacy and security
            </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
            <div className="space-y-4">
                <Button variant="outline"
                className="w-full justify-start glass-light border-border/30 hover:text-warning">
                    <Shield className="h-4 w-4 mr-2"/>
                    Change password
                </Button>

                <Button variant="outline"
                className="w-full justify-start glass-light border-border/30 hover:text-info">
                    <Bell className="h-4 w-4 mr-2"/>
                    Setting notification
                </Button>

                <Button variant="outline"
                className="w-full justify-start glass-light border-border/30 hover:text-destructive">
                    <ShieldBan className="h-4 w-4 mr-2"/>
                    Report
                </Button>
            </div>
        </CardContent>
    </Card>
);

export default PrivacySettings;