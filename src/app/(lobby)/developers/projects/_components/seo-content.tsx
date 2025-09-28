import Shell from "@/layouts/shell";

/**
 * SEO content section component with real estate development information
 */
export function SeoContent() {
  return (
    <section className="border-brand-border border-t bg-white">
      <Shell className="py-16 md:py-20">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            <div>
              <h2 className="text-brand-accent mb-6 text-2xl font-bold">
                Top Estate Developers in Accra
              </h2>
              <p className="text-brand-muted mb-6 leading-relaxed">
                Kumasi, Takoradi and Tema boast of being the leading Real Estate Development cities in Ghana. However, Accra tends to play a major role with residential apartments and major estates. Accra has somehow attracted the top Real Estate Developers in Ghana like Clifton Homes, Devtraco Limited, Denya Developers, Regimanuel Estates, and more. The quality of construction in real estate has improved in recent times. People are now willing to pay for quality in high-demand areas like East Legon, Adjiringanor, Airport Residential Area and Ogbojo.
              </p>
            </div>

            <div>
              <h2 className="text-brand-accent mb-6 text-2xl font-bold">
                Real Estate Companies Selling Lands in Ghana
              </h2>
              <p className="text-brand-muted mb-6 leading-relaxed">
                The top real estate companies selling land in Ghana include TDC land, Appolonia City, Properties Portfolio and Redrow Ghana. Other property developers to look out for are luxury real estate developers in Ghana.
              </p>
            </div>

            <div>
              <h2 className="text-brand-accent mb-6 text-2xl font-bold">
                Advantages of Dealing with a Real Estate Development Company
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-brand-accent mb-3 text-xl font-semibold">
                    Finance:
                  </h3>
                  <p className="text-brand-muted leading-relaxed">
                    You save a significant amount of money when you select one of the leading real estate developers in Ghana. The transaction includes VAT which is paid by the developer. Usually, most of these properties are first initialized with a 10 percent down-payment before everything is completed.
                  </p>
                </div>

                <div>
                  <h3 className="text-brand-accent mb-3 text-xl font-semibold">
                    Customization:
                  </h3>
                  <p className="text-brand-muted leading-relaxed">
                    With a development property, you have the power to choose different designs, layout, size and finishes before they are even built for you. You may have to glance through their portfolio to select the right design, location and price before the project starts. Or you have the choice to select an already built apartment or house.
                  </p>
                </div>

                <div>
                  <h3 className="text-brand-accent mb-3 text-xl font-semibold">
                    Comfort:
                  </h3>
                  <p className="text-brand-muted leading-relaxed">
                    Developed estates typically have security, good road infrastructure, utilities and other amenities that make life easy. You are less likely to have to worry about bad roads or disturbances in your community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}