/**
 * Footer Component
 * ================
 * Simple footer with navigation links.
 */


export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/30" role="contentinfo">
      <div className="container-wide py-8">
        <div className="flex justify-center">
          <span className="text-sm text-muted-foreground">
            © {currentYear} DataGen. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;