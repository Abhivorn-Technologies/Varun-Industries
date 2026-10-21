type PageHeaderProps = {
  label: string;
  title: string;
  intro?: string;
};

export function PageHeader({ label, title, intro }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="container">
        <p className="label" data-reveal="">{label}</p>
        <h1 data-reveal="">{title}</h1>
        {intro && <p data-reveal="">{intro}</p>}
      </div>
    </header>
  );
}
