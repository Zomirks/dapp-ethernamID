const Footer = () => {
    return (
        <footer className="border-t mt-16">
            <div className="container mx-auto px-4 py-6">
                <p className="text-center text-sm">
                    All rights reserved &copy; Eternam ID {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    )
}
export default Footer