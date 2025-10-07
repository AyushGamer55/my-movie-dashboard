import { Metadata } from 'next';
import { siteConfig } from '@/configs/site';

export const metadata: Metadata = {
  title: `Terms of Use - ${siteConfig.name}`,
  description: 'Terms of use for the movie dashboard application.',
};

export default function TermsOfUse() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Terms of Use</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="mb-4">
          Welcome to {siteConfig.name}. By accessing and using this website, you
          accept and agree to be bound by the terms and provision of this
          agreement.
        </p>
        <h2 className="mb-3 mt-6 text-2xl font-semibold">Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the
          materials on {siteConfig.name} for personal, non-commercial transitory
          viewing only.
        </p>
        <h2 className="mb-3 mt-6 text-2xl font-semibold">Disclaimer</h2>
        <p className="mb-4">
          The materials on {siteConfig.name} are provided on an 'as is' basis.{' '}
          {siteConfig.name} makes no warranties, expressed or implied, and
          hereby disclaims and negates all other warranties including without
          limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual
          property or other violation of rights.
        </p>
        <h2 className="mb-3 mt-6 text-2xl font-semibold">Limitations</h2>
        <p className="mb-4">
          In no event shall {siteConfig.name} or its suppliers be liable for any
          damages (including, without limitation, damages for loss of data or
          profit, or due to business interruption) arising out of the use or
          inability to use the materials on {siteConfig.name}.
        </p>
        <h2 className="mb-3 mt-6 text-2xl font-semibold">
          Contact Information
        </h2>
        <p className="mb-4">
          If you have any questions about these Terms of Use, please contact us
          at {siteConfig.author}.
        </p>
      </div>
    </div>
  );
}
