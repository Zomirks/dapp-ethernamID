"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import Referral from "@/components/shared/Referral";
import SCBalance from "@/components/shared/SCBalance";

const Profil = () => {
	const { isConnected } = useAccount();
	const router = useRouter();

	if (!isConnected) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Card className="w-full max-w-md bg-eternam-dark border-eternam-muted/20">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-eternam-primary/10">
							<Wallet className="h-6 w-6 text-eternam-primary" />
						</div>
						<CardTitle className="text-eternam-light">
							Connexion requise
						</CardTitle>
						<CardDescription className="text-eternam-muted">
							Connectez votre wallet pour accéder à votre profil et gérer vos parrainages.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-center">
						<Button
							onClick={() => router.push("/")}
							className="bg-eternam-primary hover:bg-eternam-primary/90"
						>
							Retour à l'accueil
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-eternam-light">Mon Profil</h1>
				<p className="mt-1 text-eternam-muted">
					Gérez votre compte et vos parrainages
				</p>
			</div>
			<section>
				<Referral />
			</section>
			<section>
				<SCBalance />
			</section>
		</div>
	);
};

export default Profil;