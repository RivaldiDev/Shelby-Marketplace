import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import NavWalletIsland from './NavWalletIsland';

const links = [
  { href: '/browse', label: 'Browse' },
  { href: '/upload', label: 'Publish' },
  { href: '/my-blobs', label: 'Dashboard' },
  { href: 'https://aptoslabs.com/testnet-faucet', label: 'Get APT', external: true },
];

const lineTransition = { type: 'spring', stiffness: 520, damping: 34, mass: 0.65 } as const;
const menuTransition = { type: 'spring', stiffness: 430, damping: 38, mass: 0.75 } as const;

export default function NavMenuIsland() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 760) setOpen(false);
    };
    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  const lineTop = open ? { rotate: 45, y: 5.5, width: 24, right: 10 } : { rotate: 0, y: 0, width: 18, right: 12 };
  const lineBottom = open ? { rotate: -45, y: -5.5, width: 24, right: 10 } : { rotate: 0, y: 0, width: 24, right: 12 };

  return (
    <div className="nav-react-shell">
      <motion.button
        type="button"
        className="burger-button"
        aria-label="Toggle navigation"
        aria-controls="mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        whileHover={reduceMotion ? undefined : { y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <motion.span
          className="burger-aura"
          aria-hidden="true"
          animate={open ? { rotate: 18, scale: 1.1, opacity: 1 } : { rotate: 0, scale: 1, opacity: 0.86 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        />
        <motion.span
          className="burger-dot"
          aria-hidden="true"
          animate={open ? { scale: 0.25, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        />
        <motion.span className="burger-line burger-line-top" aria-hidden="true" animate={lineTop} transition={lineTransition} />
        <motion.span className="burger-line burger-line-bottom" aria-hidden="true" animate={lineBottom} transition={lineTransition} />
      </motion.button>

      <div className="nav-menu nav-menu-desktop" id="desktop-menu">
        <nav className="nav-links">
          {links.map((link) => (
            <a key={link.href} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined}>
              {link.label}
            </a>
          ))}
        </nav>
        <NavWalletIsland />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {open && (
          <motion.div
            key="mobile-menu"
            className="nav-menu nav-menu-mobile"
            id="mobile-menu"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98, filter: 'blur(8px)' }}
            transition={menuTransition}
          >
            <nav className="nav-links">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: 'easeOut', delay: reduceMotion ? 0 : index * 0.035 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="nav-wallet-motion"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: 'easeOut', delay: reduceMotion ? 0 : 0.12 }}
            >
              <NavWalletIsland />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
