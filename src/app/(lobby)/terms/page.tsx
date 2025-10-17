import { siteConfig } from "@/config/site";
/* eslint-disable react/no-unescaped-entities */
import Shell from "@/layouts/shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use - MeQasa Platform Terms & Conditions",
  description:
    "Read MeQasa's Terms of Use to understand your rights and responsibilities when using Ghana's leading property platform. Updated terms and conditions for users, property owners, and agents.",
  keywords: [
    "meqasa terms of use",
    "ghana property platform terms",
    "real estate terms conditions",
    "meqasa user agreement",
    "property listing terms",
    "legal terms ghana",
    "user rights responsibilities",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/terms",
    siteName: siteConfig.name,
    title: "Terms of Use - MeQasa Platform Terms & Conditions",
    description:
      "Read MeQasa's Terms of Use to understand your rights and responsibilities when using Ghana's leading property platform.",
    images: [
      {
        url: `${siteConfig.url}/og-terms.jpg`,
        width: 1200,
        height: 630,
        alt: "MeQasa Terms of Use",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Shell className="py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-brand-accent mb-4 text-4xl font-bold md:text-5xl">
            Meqasa Terms of Use
          </h1>
          <p className="text-brand-muted mx-auto max-w-3xl text-lg">
            By using Meqasa's Web sites (defined to include all properties
            (mobile, Web or otherwise) owned and operated by Meqasa), related
            data, and/or related services (collectively, "Services"), you agree
            to be bound by the following terms of use, as updated from time to
            time ("Terms of Use").
          </p>
        </div>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none space-y-8">
          {/* General Terms */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              GENERAL TERMS
            </h2>
            <ul className="text-brand-muted list-disc space-y-2 pl-6 leading-relaxed">
              <li>
                I acknowledge that for all the properties that I list on Meqasa,
                I either own the property, or have direct consent and permission
                from the property owner to represent him as his agent.
              </li>
              <li>
                For Meqasa to promote the properties in my account, I will list
                directly or provide an authorised Meqasa representative with
                adequate information (identifiable location, detailed
                description and pictures) on each of the properties that I wish
                to sell or rent so they can list to meqasa.com on my behalf.
              </li>
              <li>
                I agree to promptly communicate the sale, lease, or any other
                change in the status of a property I represent to Meqasa.
              </li>
              <li>
                Either party has the right to terminate this agreement at any
                time. Termination of the agreement should be done in writing or
                by email. Note that agent/agency is not entitled to any refund
                in this case.
              </li>
            </ul>
          </section>

          {/* 1. Permissible Use */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              1. Permissible Use.
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              Unless you are a real estate professional or home owner, you agree
              to use the Services for your personal use, and your commercial use
              is limited to transactions done on your own behalf. The commercial
              use of real estate professionals and home owners is limited to
              providing information to consumers via the Services or, where
              authorized, taking actions on behalf of a consumer client (e.g.,
              post a home for sale). The Services may be used only for
              transactions in residential real estate and may not be used for
              transactions in commercial real estate, which includes, without
              limitation, commercially zoned properties, timeshares, and
              vacation rentals. Subject to the restrictions set forth in the
              following paragraphs, you may copy information from the Services
              only as necessary for your personal use to view, save, print, fax
              and/or e-mail such information. You agree otherwise not to
              reproduce, modify, distribute, display or otherwise provide access
              to, create derivative works from, decompile, disassemble or
              reverse engineer any portion of the Services. Notwithstanding the
              foregoing, the aggregate level data provided on meqasa.com, (the
              "Aggregate Data") may be used for non-personal uses, e.g., real
              estate market analysis. You may display and distribute derivative
              works of the Aggregate Data (e.g., within a graph), with Meqasa
              cited as a source.
            </p>
          </section>

          {/* 2. Restrictions and Additional Terms */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              2. Restrictions and Additional Terms.
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              You agree not to remove or modify any copyright or other
              intellectual property notices that appear in the Services. You
              will not use the Services for resale, service bureau, time-sharing
              or other similar purposes. Further:
            </p>

            <div className="mb-4">
              <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                a. Acceptable Use.
              </h3>
              <p className="text-brand-muted mb-2 leading-relaxed">
                You agree not to use the Services in any way that is unlawful,
                or harms Meqasa, its service providers, suppliers or any other
                user. You agree not to use the Services in any way that breaches
                the Meqasa Marketplace Code of Conduct, or any other policy or
                notice on the Services. You agree not to distribute or post
                spam, chain letters, pyramid schemes, or similar communications
                through the Services. You agree not to impersonate another
                person or misrepresent your affiliation with another person or
                entity. Except as expressly stated herein, these Terms of Use do
                not provide you a license to use, reproduce, distribute, display
                or provide access to any portion of the Services on third-party
                Web sites or otherwise.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                b. Automated Queries.
              </h3>
              <p className="text-brand-muted leading-relaxed">
                Automated queries (including screen and database scraping,
                spiders, robots, crawlers and any other automated activity with
                the purpose of obtaining information from the Services) are
                strictly prohibited on the Services, unless you have received
                express written permission from Meqasa. As a limited exception,
                publicly available search engines and similar Internet
                navigation tools ("Search Engines") may query the Services and
                provide an index with links to the Services' Web pages, only to
                the extent such unlicensed "fair use" is allowed by applicable
                copyright law. Search Engines are not permitted to query or
                search information protected by a security verification system
                ("captcha") which limits access to human users.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                c. Google Maps.
              </h3>
              <p className="text-brand-muted leading-relaxed">
                Some of the Services implement the Google Maps web mapping
                service. Your use of Google Maps is subject to Google's terms of
                use, located at
                http://www.google.com/intl/en_us/help/terms_maps.html.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                d. Calls.
              </h3>
              <p className="text-brand-muted leading-relaxed">
                The Services may provide phone numbers that can connect you with
                Meqasa, its service providers, or other third parties, such as
                real estate agents and home owners.
              </p>
            </div>
          </section>

          {/* 3. Materials You Provide; Account Use; Privacy; Third Party Web Sites */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              3. Materials You Provide; Account Use; Privacy; Third Party Web
              Sites.
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              For materials you post or otherwise provide to Meqasa in
              connection with the Services (your "Submission"), you grant Meqasa
              an irrevocable, perpetual, royalty-free worldwide license to (a)
              use, copy, distribute, transmit, publicly display, publicly
              perform, reproduce, edit, modify, prepare derivative works of or
              incorporate into other works, and translate your Submission, in
              connection with the Services or in any other media, and (b)
              sublicense these rights, to the maximum extent permitted by
              applicable law. Meqasa will not pay you for your Submission or to
              exercise any rights related to your Submission set forth in the
              preceding sentence. Meqasa may remove or modify your Submission at
              any time. For each Submission, you agree to provide accurate and
              complete information and represent that you have all rights
              necessary to grant Meqasa the rights in this paragraph and that
              the Submission complies with Section 2(a) above. You are solely
              responsible for all Submissions made through your Meqasa user
              account or that you otherwise make available through the Services.
              You may not share your Meqasa user account with others. You are
              responsible for all actions taken via your account. Certain Meqasa
              functionalities may involve the distribution of your Submission to
              third party Web sites over which Meqasa has no control. Meqasa is
              not responsible for and makes no warranties or representations
              pertaining to these third party Web sites, including but not
              limited to the content, availability, or functionality of such Web
              sites. You are responsible for ensuring that your Submission
              complies with the terms of use associated with any such third
              party Web site and you understand that your Submission and your
              use of a third party Web site will be treated in accordance with
              that third party Web site's own privacy policy.
            </p>
          </section>

          {/* 4. Advertising */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              4. Advertising.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              Meqasa's business is primarily funded through advertising. You
              understand and agree that the Services may include advertisements,
              and that these are necessary to support the Services. To help make
              the advertisements relevant and useful to you, Meqasa may serve
              advertisements based on the information we collect from you or in
              relation to your interaction on our site.
            </p>
          </section>

          {/* 5. Software */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              5. Software.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              The Services may include software for use in connection with the
              Services. If such software is accompanied by an end user license
              agreement ("EULA"), the terms of the EULA will govern your use of
              the software. If such software is not accompanied by a EULA, then
              Meqasa grants to you a non-exclusive, revocable, personal,
              non-transferable license to use such software solely in connection
              with the Services and in accordance with these Terms of Use.
            </p>
          </section>

          {/* 6. Disclaimer of Warranties */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              6. Disclaimer of Warranties.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT
              NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR
              A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. MEQASA DOES NOT
              WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE,
              THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVER
              THAT MAKES THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL
              COMPONENTS.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              7. Limitation of Liability.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              IN NO EVENT SHALL MEQASA, ITS AFFILIATES, OR THEIR RESPECTIVE
              DIRECTORS, OFFICERS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE,
              GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF
              THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY
              OTHER LEGAL THEORY, AND WHETHER OR NOT MEQASA HAS BEEN ADVISED OF
              THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL MEQASA'S TOTAL
              LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, OR CAUSES OF ACTION
              EXCEED THE AMOUNT YOU HAVE PAID TO MEQASA IN THE TWELVE (12)
              MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          {/* 8. Indemnification */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              8. Indemnification.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              You agree to defend, indemnify, and hold harmless Meqasa, its
              affiliates, and their respective directors, officers, employees,
              and agents from and against any and all claims, damages,
              obligations, losses, liabilities, costs or debt, and expenses
              (including but not limited to attorney's fees) arising from: (i)
              your use of and access to the Services; (ii) your violation of any
              term of these Terms of Use; (iii) your violation of any third
              party right, including without limitation any copyright, property,
              or privacy right; or (iv) any claim that your Submission caused
              damage to a third party.
            </p>
          </section>

          {/* 9. Termination */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              9. Termination.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              You may terminate your account at any time by contacting our
              support team. Meqasa may suspend or terminate your account and
              your access to the Services immediately, without prior notice or
              liability, for any reason whatsoever, including without limitation
              if you breach the Terms of Use. Upon termination, your right to
              use the Services will cease immediately. If you wish to terminate
              your account, you may simply discontinue using the Services.
            </p>
          </section>

          {/* 10. Changes; Discontinuance */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              10. Changes; Discontinuance.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              Meqasa reserves the right to change these Terms of Use at any time
              in its sole discretion. Any changes will be effective immediately
              upon posting the revised version of these Terms of Use to Meqasa's
              Web sites. Your continued use of the Services after the
              effectiveness of such changes will constitute acceptance of and
              agreement to any such changes. You further waive any right you may
              have to receive specific notice of such changes to these Terms of
              Use. You are responsible for regularly reviewing these Terms of
              Use. Meqasa may alter, suspend or discontinue the Services at any
              time to you and/or to others, without notice.
            </p>
          </section>

          {/* 11. Governing Law */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              11. Governing Law.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              These Terms of Use shall be governed by and construed in
              accordance with the laws of Ghana, without regard to its conflict
              of law provisions. You agree to submit to the personal and
              exclusive jurisdiction of the courts located within Ghana.
            </p>
          </section>

          {/* 12. General */}
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              12. General.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              You agree not to export from anywhere any part of the Services
              provided to you or any direct product thereof except in compliance
              with, and with all licenses and approvals required under,
              applicable export laws, rules and regulations. If any part of
              these Terms of Use is determined to be invalid or unenforceable,
              then the invalid or unenforceable provision will be replaced with
              a valid, enforceable provision that most closely matches the
              intent of the original provision and the remainder of these Terms
              of Use will continue in effect. The section titles in these Terms
              of Use are solely used for the convenience of the parties and have
              no legal or contractual significance. Meqasa may assign this
              Agreement, in whole or in part, at any time with or without notice
              to you. You may not assign these Terms of Use, or assign, transfer
              or sublicense your rights, if any, in the Service. Meqasa's
              failure to act with respect to a breach by you or others does not
              waive its right to act with respect to subsequent or similar
              breaches. Except as expressly stated herein, these Terms of Use
              constitute the entire agreement between you and Meqasa with
              respect to the Services and supersede all prior or contemporaneous
              communications of any kind between you and Meqasa with respect to
              the Services.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mt-12 border-t border-gray-200 pt-8">
            <div className="text-center">
              <h2 className="text-brand-accent mb-4 text-2xl font-bold">
                Contact Us
              </h2>
              <p className="text-brand-muted mb-4">
                If you have any questions about these Terms of Use, please
                contact us:
              </p>
              <div className="text-brand-muted space-y-2">
                <p>
                  <strong>Phone:</strong> +233 506 866 060
                </p>
                <p>
                  <strong>Email:</strong> info@meqasa.com
                </p>
              </div>
              <p className="text-brand-muted mt-4 text-sm">
                - Updated July 2013
              </p>
            </div>
          </section>
        </div>
      </Shell>
    </div>
  );
}
