import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <a href="#" className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-primary text-primary" />
          <span className="font-display text-lg font-bold text-foreground">
            BreastCare
          </span>
        </a>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          This project is for educational and awareness purposes only. Always
          consult a qualified healthcare professional for medical advice.
        </p>
        <div className="flex items-center gap-6">
          <a href="#about" className="text-xs text-muted-foreground transition-colors hover:text-primary">About</a>
          <a href="#symptoms" className="text-xs text-muted-foreground transition-colors hover:text-primary">Symptoms</a>
          <a href="#prediction" className="text-xs text-muted-foreground transition-colors hover:text-primary">Prediction</a>
          <a href="#prevention" className="text-xs text-muted-foreground transition-colors hover:text-primary">Prevention</a>
        </div>
        <p className="text-xs text-muted-foreground">
          Project by Sambhav Sharma | Manipal University Jaipur
        </p>
      </div>
    </footer>
  )
}
