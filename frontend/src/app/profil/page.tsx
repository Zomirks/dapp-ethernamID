import Referral from "@/components/shared/Referral";
import SCBalance from "@/components/shared/SCBalance";

const Profil = () => {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-eternam-light">Mon Profil</h1>
				<p className="mt-1 text-eternam-muted">Gérez votre compte et vos parrainages</p>
			</div>

			<section>
				<Referral />
			</section>

			<section>
				<SCBalance />
			</section>
		</div>
	)
}
export default Profil