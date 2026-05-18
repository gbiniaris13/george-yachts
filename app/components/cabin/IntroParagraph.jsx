// Italic Lato/Sentient intro paragraph used at the top of every
// brief section. Soft navy, line-height 1.8, max 540px.

export default function IntroParagraph({ children }) {
  return (
    <p className="cabin-intro-paragraph">
      {children}
      <style>{`
        .cabin-intro-paragraph {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14.5px;
          line-height: 1.8;
          color: rgba(13, 27, 42, 0.72);
          max-width: 540px;
          margin: 0;
        }
      `}</style>
    </p>
  );
}
