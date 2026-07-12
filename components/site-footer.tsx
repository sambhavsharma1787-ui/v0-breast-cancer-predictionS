import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-white to-primary/5 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3 mb-12">
          <div className="flex flex-col items-start md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4 group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <Heart className="h-5 w-5 fill-primary text-primary" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                BreastCare
              </span>
            </a>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Empowering early detection through data-driven insights and health awareness.
            </p>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a>
              </div>
              <div>
                <a href="#symptoms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Symptoms</a>
              </div>
              <div>
                <a href="#prediction" className="text-sm text-muted-foreground hover:text-primary transition-colors">Prediction</a>
              </div>
              <div>
                <a href="#prevention" className="text-sm text-muted-foreground hover:text-primary transition-colors">Prevention</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            © 2024 BreastCare. Educational purposes only. Always consult a healthcare professional.
          </p>
          <p className="text-xs text-muted-foreground">
            Project by Sambhav Sharma | Manipal University Jaipur
          </p>
        </div>
      </div>
    </footer>
  )
}
