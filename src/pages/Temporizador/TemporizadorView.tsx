interface TemporizadorViewProps {
  goBack: () => void;
}

const TemporizadorView = ({ goBack }: TemporizadorViewProps) => {
  return (
    <div className="p-10">
      <div className="p-10">Vista Cronómetro</div>;
      <button onClick={goBack}>Volver</button>
    </div>
  )
};

export default TemporizadorView;