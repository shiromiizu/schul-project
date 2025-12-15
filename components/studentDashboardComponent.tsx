import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageSquare, FileText } from "lucide-react"

// Translated all visible texts to German
const recentFeedback = [
	{
		id: 1,
		title: "Fehler im Checkout-Prozess",
		description: "Der Zahlungsbutton reagiert nicht auf mobilen Geräten",
		status: "new" as const,
		date: "2024-01-15",
		category: "Fehlermeldung",
	},
	{
		id: 2,
		title: "Funktionswunsch: Dunkelmodus",
		description: "Es wäre toll, eine Dunkelmodus-Option für das Dashboard zu haben",
		status: "seen" as const,
		date: "2024-01-14",
		category: "Funktionswunsch",
	},
	{
		id: 3,
		title: "Vorschlag für verbesserte Navigation",
		description: "Das Hauptmenü könnte mit besseren Beschriftungen intuitiver sein",
		status: "answered" as const,
		date: "2024-01-13",
		category: "Vorschlag",
	},
]

const statusConfig = {
	new: {
		label: "Neu",
		variant: "default" as const,
		color: "bg-blue-500",
	},
	seen: {
		label: "Gesehen",
		variant: "secondary" as const,
		color: "bg-amber-500",
	},
	answered: {
		label: "Beantwortet",
		variant: "outline" as const,
		color: "bg-green-500",
	},
}

// Adjusted paddings for a more natural feel
const StudentDashboardComponent = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* Header */}
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-slate-900 mb-2">Feedback-Dashboard</h1>
					<p className="text-slate-600">Verfolgen und verwalten Sie Ihre Feedback-Einreichungen</p>
				</header>

				{/* Quick Actions */}
				<div className="grid gap-4 md:grid-cols-2 mb-8">
					<Link href="/feedback" className="group">
						<Card className="transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-blue-500">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="p-3 bg-blue-100 rounded-lg">
											<MessageSquare className="h-6 w-6 text-blue-600" />
										</div>
										<div>
											<CardTitle className="text-xl">Feedback einreichen</CardTitle>
											<CardDescription>Teilen Sie uns Ihre Meinung mit</CardDescription>
										</div>
									</div>
									<ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
								</div>
							</CardHeader>
						</Card>
					</Link>

					<Link href="/petitions" className="group">
						<Card className="transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-purple-500">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="p-3 bg-purple-100 rounded-lg">
											<FileText className="h-6 w-6 text-purple-600" />
										</div>
										<div>
											<CardTitle className="text-xl">Petitionen ansehen</CardTitle>
											<CardDescription>Durchsuchen und unterstützen Sie Petitionen</CardDescription>
										</div>
									</div>
									<ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
								</div>
							</CardHeader>
						</Card>
					</Link>
				</div>

				{/* Recent Feedback Section */}
				<Card className="shadow-xl">
					<CardHeader>
						<CardTitle className="text-2xl">Aktuelles Feedback</CardTitle>
						<CardDescription>Ihre letzten 3 eingereichten Feedbacks</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{recentFeedback.map((feedback) => {
							const status = statusConfig[feedback.status]
							const isHighlighted = feedback.status === "new" || feedback.status === "seen"

							return (
								<Card
									key={feedback.id}
									className={`transition-all ${
										isHighlighted ? "border-2 border-blue-500 bg-blue-50/50 shadow-md" : "border hover:shadow-md"
									}`}
								>
									<CardContent className="p-5">
										<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
											<div className="flex-1 space-y-3">
												<div className="flex flex-wrap items-center gap-3">
													<h3 className="text-lg font-semibold text-slate-900">{feedback.title}</h3>
													{isHighlighted && (
														<span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full animate-pulse">
															Benötigt Aufmerksamkeit
														</span>
													)}
												</div>
												<p className="text-slate-600 text-sm leading-relaxed">{feedback.description}</p>
												<div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
													<Badge variant="outline" className="font-normal">
														{feedback.category}
													</Badge>
													<span>•</span>
													<time>
														{new Date(feedback.date).toLocaleDateString("de-DE", {
															month: "short",
															day: "numeric",
															year: "numeric",
														})}
													</time>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<div className={`w-2 h-2 rounded-full ${status.color}`} />
												<Badge variant={status.variant} className="whitespace-nowrap">
													{status.label}
												</Badge>
											</div>
										</div>
									</CardContent>
								</Card>
							)
						})}
					</CardContent>
				</Card>

				{/* Status Legend */}
				<Card className="mt-6 bg-slate-50">
					<CardContent className="pt-6">
						<div className="flex flex-wrap items-center gap-6 text-sm">
							<span className="font-medium text-slate-700">Status-Legende:</span>
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 rounded-full bg-blue-500" />
								<span className="text-slate-600">Neu - Wartet auf Überprüfung</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 rounded-full bg-amber-500" />
								<span className="text-slate-600">Gesehen - Wird überprüft</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 rounded-full bg-green-500" />
								<span className="text-slate-600">Beantwortet - Antwort bereitgestellt</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default StudentDashboardComponent