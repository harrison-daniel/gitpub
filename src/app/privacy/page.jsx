'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function Privacy() {
  const router = useRouter();

  return (
    <div className='mx-auto w-full max-w-xl px-4 pt-6'>
      <button
        onClick={() => router.back()}
        className='-ml-1.5 mb-6 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-sm font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-600 dark:text-amber-400 dark:hover:bg-amber-950/30 dark:hover:text-amber-300'>
        <ChevronLeft size={16} />
        Back
      </button>

      <div className='bg-white/85 dark:bg-neutral-900/85 rounded-2xl border border-amber-200/60 p-8 shadow-sm backdrop-blur-sm dark:border-neutral-700/60'>
        <div className='flex flex-col '>
          <div className='mx-auto max-w-3xl space-y-6 px-6 py-12'>
            <h1 className='text-xl font-bold'>Privacy Policy</h1>
            <p className='text-sm text-gray-500'>
              Last updated: February 23, 2026
            </p>

            <section>
              <h2 className='text-sm font-semibold'>Overview</h2>
              <p className='text-xs'>
                This Privacy Policy describes how this application (“GitPub”)
                collects, uses, and protects your information when you use the
                service.
              </p>
              <p className='text-xs'>
                This App is a personal portfolio project designed to allow users
                to search for breweries and save journal-style entries. It is
                not a commercial service and does not sell or share personal
                data.
              </p>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>Information We Collect</h2>
              <p className='text-xs'>
                When you sign in using Google or GitHub authentication, we may
                collect:
              </p>
              <ul className='ml-6 list-disc text-xs'>
                <li>Your name</li>
                <li>Email address</li>
                <li>Profile image (if provided by your OAuth provider)</li>
              </ul>

              <p className='text-xs'>
                When you use the App’s features, we may store:
              </p>
              <ul className='ml-6 list-disc text-xs'>
                <li>Brewery entries you save</li>
                <li>Notes or reviews you write</li>
                <li>Dates associated with your saved entries</li>
                <li>
                  Brewery information (name, location, website, phone)
                  associated with your saved items
                </li>
              </ul>

              <p className='text-xs'>
                We do not collect passwords, payment information, or sensitive
                personal data.
              </p>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>
                How We Use Your Information
              </h2>
              <p>We use your information solely to:</p>
              <ul className='ml-6 list-disc text-xs'>
                <li>Authenticate your account</li>
                <li>Associate your saved entries with your profile</li>
                <li>Display your saved data when you return</li>
              </ul>
              <p className='text-xs'>
                We do not use your data for advertising, tracking, or marketing.
              </p>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>
                Authentication Providers
              </h2>
              <p className='text-xs'>
                Authentication is handled securely through third-party
                providers:
              </p>
              <ul className='ml-6 list-disc text-xs'>
                <li>Google OAuth</li>
                <li>GitHub OAuth</li>
              </ul>
              <p className='text-xs'>
                We only receive basic profile information from these services.
                We do not have access to your passwords or private accounts on
                those platforms.
              </p>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>Third-Party Services</h2>
              <p className='text-xs'>
                The App relies on the following services:
              </p>
              <ul className='ml-6 list-disc text-xs'>
                <li>Authentication providers (Google and GitHub) for login</li>
                <li>
                  A brewery data API (OpenBreweryDB) to fetch brewery
                  information
                </li>
                <li>MongoDB database to securely store user entries</li>
              </ul>
              <p className='text-xs'>
                These services may process data as required to perform their
                functionality.
              </p>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>
                Data Storage and Security
              </h2>
              <p className='text-xs'>
                Your information is stored securely using a hosted database
                service. Reasonable technical measures are used to protect
                stored data from unauthorized access, disclosure, or misuse.
              </p>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>Data Sharing</h2>
              <p className='text-xs'>
                We do not sell, rent, or trade your personal information.
              </p>
              <p className='text-xs'>
                Your data is only accessible to the application for
                functionality purposes.
              </p>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>Data Retention</h2>
              <p className='text-xs'>
                Your saved entries and account information are stored until:
              </p>
              <ul className='ml-6 list-disc'>
                <li className='text-xs'>you request deletion, or</li>
                <li className='text-xs'>the project is discontinued.</li>
              </ul>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>Your Rights</h2>
              <p className='text-xs'>
                You may request that your data be deleted at any time by
                visiting the user Dashboard and using the account deletion
                feature or by contacting us.
              </p>
              <p className='text-xs font-medium'>
                Contact Email: pfoliohd@gmail.com
              </p>
              <p className='text-xs'>
                Upon request, your stored information will be permanently
                removed.
              </p>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>Changes to This Policy</h2>
              <p className='text-xs'>
                This Privacy Policy may be updated occasionally to reflect
                improvements or changes to the application. The “Last updated”
                date will always indicate the latest version.
              </p>
            </section>

            <section>
              <h2 className='text-sm font-semibold'>Contact</h2>
              <p className='text-xs'>
                If you have questions about this Privacy Policy, you can contact
                us at: pfoliohd@gmail.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
