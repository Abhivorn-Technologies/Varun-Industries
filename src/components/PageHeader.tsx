type PageHeaderProps = {
  label: string;
  title: string;
  intro?: string;
};

export function PageHeader({ label, title, intro }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="container">
        <p className="label">{label}</p>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </header>
  );
}
