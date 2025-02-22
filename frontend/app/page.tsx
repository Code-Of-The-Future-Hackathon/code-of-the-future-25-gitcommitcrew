import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Server, Shield, Activity, Globe } from "lucide-react";

export default function Home() {
	return (
		<div className="from-background to-secondary min-h-screen bg-gradient-to-b">
			<div className="container mx-auto px-4 py-24">
				<div className="mb-16 text-center">
					<h1 className="from-primary mb-6 bg-gradient-to-r to-blue-600 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
						DataSentry
					</h1>
					<p className="text-muted-foreground mx-auto max-w-3xl text-xl md:text-2xl">
						Real-time monitoring and analytics for your entire infrastructure
						ecosystem
					</p>
					<div className="mt-10">
						<Link href="/auth">
							<Button size="lg" className="px-8 py-6 text-lg">
								Get Started <ArrowRight className="ml-2" />
							</Button>
						</Link>
					</div>
				</div>

				{/* Features Grid */}
				<div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
					<FeatureCard
						icon={<Server className="h-10 w-10" />}
						title="Host Monitoring"
						description="Track system performance metrics across all your devices in real-time"
					/>
					<FeatureCard
						icon={<Shield className="h-10 w-10" />}
						title="Secure Access"
						description="Enterprise-grade security with role-based access control"
					/>
					<FeatureCard
						icon={<Activity className="h-10 w-10" />}
						title="Live Analytics"
						description="Detailed insights and performance analytics at your fingertips"
					/>
					<FeatureCard
						icon={<Globe className="h-10 w-10" />}
						title="Global Overview"
						description="Unified dashboard for your entire infrastructure"
					/>
				</div>

				{/* Stats Section */}
				<div className="mt-24 grid gap-8 text-center md:grid-cols-3">
					<StatCard number="99.9%" label="Uptime" />
					<StatCard number="<50ms" label="Latency" />
					<StatCard number="24/7" label="Monitoring" />
				</div>
			</div>

			{/* Footer */}
			<footer className="text-muted-foreground mt-24 border-t py-8 text-center">
				<p>© 2024 Smart Infrastructure Monitor. Built for the Hackathon.</p>
			</footer>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="bg-card rounded-xl border p-6 transition-all hover:shadow-lg">
			<div className="text-primary mb-4">{icon}</div>
			<h3 className="mb-2 text-xl font-semibold">{title}</h3>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}

function StatCard({ number, label }: { number: string; label: string }) {
	return (
		<div className="bg-card rounded-xl border p-6">
			<div className="text-primary mb-2 text-4xl font-bold">{number}</div>
			<div className="text-muted-foreground">{label}</div>
		</div>
	);
}
