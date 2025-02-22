import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DeviceSettingsPage() {
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold">Device Settings</h2>

			<Card>
				<CardHeader>
					<CardTitle>General Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Device Name</Label>
						<Input id="name" defaultValue="server-01" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input id="description" />
					</div>
					<Button>Save Changes</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Danger Zone</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button variant="destructive">Unclaim Device</Button>
				</CardContent>
			</Card>
		</div>
	);
}
