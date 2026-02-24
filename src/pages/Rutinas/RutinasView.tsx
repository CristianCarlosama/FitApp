interface RutinasViewProps {
  goBack: () => void;
}

const RutinasView = ({ goBack }: RutinasViewProps) => {
  return (
    <div className="p-10">
      <div className="p-10">Vista Cronómetro</div>;
      <button onClick={goBack}>Volver</button>
    </div>
  )
};

export default RutinasView;