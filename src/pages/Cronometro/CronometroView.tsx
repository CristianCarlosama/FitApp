interface CronometroViewProps {
  goBack: () => void;
}

const CronometroView = ({ goBack }: CronometroViewProps) => {
  return (
    <div className="p-10">
      <div>Vista Cronómetro</div>;
      <button onClick={goBack}>Volver</button>
    </div>
  );
};

export default CronometroView;