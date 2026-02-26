interface TemporizadorViewProps {
  goBack: () => void;
}

const TemporizadorView = ({ goBack }: TemporizadorViewProps) => {
  return (
    <div className="p-10">
      <div className="p-10">Próximamente Temporizador</div>;
      <button
        onClick={goBack}
        className="text-gray-400 hover:text-white transition"
      >
        Volver
      </button>
    </div>
  )
};

export default TemporizadorView;