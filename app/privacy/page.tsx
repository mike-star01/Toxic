"use client"

import AppHeader from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Trash2, Eye, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <AppHeader title="Privacy Policy" showBack />
      
      <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Privacy Policy
            </CardTitle>
            <p className="text-zinc-400 text-sm mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-zinc-300">
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Overview
              </h2>
              <p className="leading-relaxed">
                Situationship Graveyard is committed to protecting your privacy. This app stores all data locally on your device and does not collect, transmit, or share any personal information with third parties, servers, or cloud services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Storage
              </h2>
              <p className="leading-relaxed mb-3">
                All data you create in this app is stored locally on your device using your device's local storage. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                <li>Situationship entries (names, dates, descriptions, photos)</li>
                <li>User preferences (grave colors, display settings)</li>
                <li>Statistics and analytics data</li>
              </ul>
              <p className="leading-relaxed mt-3">
                No data is transmitted to external servers, cloud services, or third-party services. Your data never leaves your device and is not accessible by us or any external parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Data Collection
              </h2>
              <p className="leading-relaxed mb-3">
                We do not collect any personal information. This app does not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                <li>Track your usage or behavior</li>
                <li>Use analytics or tracking tools</li>
                <li>Collect device information or identifiers</li>
                <li>Access your contacts, location, or other personal data</li>
                <li>Share data with advertisers or third parties</li>
                <li>Use cookies or similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Your Rights & Control
              </h2>
              <p className="leading-relaxed mb-3">
                You have complete control over your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                <li>You can delete individual situationships at any time</li>
                <li>You can delete all data using the "Delete All Data" option in your profile</li>
                <li>You can uninstall the app at any time, which removes all locally stored data</li>
                <li>Your data is protected by your device's built-in security measures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Data Security
              </h2>
              <p className="leading-relaxed">
                Since all data is stored locally on your device, it is protected by your device's built-in security measures. We recommend using device encryption and a secure lock screen to protect your data. We do not have access to your device or the data stored on it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Third-Party Services
              </h2>
              <p className="leading-relaxed">
                This app does not integrate with any third-party services, analytics platforms, advertising networks, or external APIs. No external services have access to your data, and no data is shared with any third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Children's Privacy
              </h2>
              <p className="leading-relaxed">
                This app is intended for users aged 17 and older. We do not knowingly collect information from children under 17. Since we do not collect any information from any users, this is inherently protected.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Changes to This Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be reflected in this document with an updated "Last updated" date. We encourage you to review this policy periodically to stay informed about how we protect your privacy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at{" "}
                <a 
                  href="mailto:toxicos@gmail.com" 
                  className="text-red-400 hover:text-red-300 underline"
                >
                  toxicos@gmail.com
                </a>
              </p>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
