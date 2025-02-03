function TermsOfServiceContainer() {
    return (
        <div className="w-[100%] md:w-[80%] m-auto pt-16 [&_section]:my-8 [&_section]:text-2xl [&_section]:bg-slate-950 [&_section]:mx-8 [&_section]:p-5 [&_h2]:text-4xl [&_h2]:pb-6 [&_li]:mb-3">

            <h1 className="text-center">Terms of Service/Data Usage</h1>

            <section>
                <h2>TL;DR</h2>

                <ul className="list-disc pl-5">
                    <li>
                        To use Yet Another TV Website, you must obtain an API Key from The Movie Database.
                    </li>
                    <li>
                        The Movie Database API Key is stored in your browser's local storage, not on our servers.
                    </li>
                    <li>
                        There's a low probability that YouTube (or its affiliates) may access your The Movie Database API Key.
                    </li>
                    <li>
                        Applications and extensions on your local machine may access your The Movie Database API Key.
                    </li>
                    <li>
                        We are not responsible for any actions or security breaches that may occur.
                    </li>
                </ul>

            </section>

            <section className="[&_section]:p-0">
                <p>Welcome to Yet Another TV Website ("the Site"). By accessing or using the Site, you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you must not use the Site.</p>

                <section>
                    <h2>1. The Movie Database API Key Requirement</h2>
                    <ol>
                        <li>
                            1.1 In order to utilize the full functionality of the Site, you must obtain a valid API Key from The Movie Database.

                        </li>
                        <li>
                            1.2 The Movie Database API Key is not sent to, stored, or used by our servers. Instead, it is stored, accessed, and used solely from your browser's local storage.

                        </li>

                    </ol>
                </section>
                <section>
                    <h2>2. The Movie Database API Key Storage and Third-Party Access</h2>
                    <ol>
                        <li>
                            2.1 Please be aware that even though The Movie Database API Key is stored in your local storage, there is a low probability that the API Key can be accessed by YouTube, as their services are utilized to display videos of trailers and other interesting content related to available shows on the Site.
                        </li>
                        <li>
                            2.2 Additionally, there is a probability that The Movie Database API Key stored in your local storage can be accessed by applications and extensions installed on your local machine.

                        </li>
                    </ol>
                </section>

                <section>
                    <h2>3. Limitation of Liability</h2>
                    <ol>
                        <li>
                            3.1 The Site is provided on an "as is" basis. We take no responsibility for any actions or security breaches that may occur while using the Site.
                        </li>
                        <li>
                            3.2 You acknowledge and agree that your use of the Site, including the storage and usage of The Movie Database API Key, is at your own risk.

                        </li>
                    </ol>
                </section>

                <section>
                    <h2>4. Amendments to the Terms</h2>
                    <ol>
                        <li>
                            4.1 We reserve the right to modify or replace these Terms at any time without prior notice.
                        </li>
                        <li>
                            4.2 It is your responsibility to review these Terms periodically for any changes. Your continued use of the Site following the posting of any changes to the Terms constitutes acceptance of those changes.

                        </li>
                    </ol>
                </section>
            </section>
        </div>
    );
}

export default TermsOfServiceContainer;