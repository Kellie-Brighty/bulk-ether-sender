interface ButtonProps {
  text: string;
  onClick?: () => void;
  key?: string | number;
  loading?: boolean;
  type?: string;
  disabled?: boolean; // {{ edit_1 }} Added disabled prop
  active?: boolean;
}

export const PrimaryButton = ({
  onClick,
  text,
  key,
  loading,
  type,
  disabled, // {{ edit_2 }} Added disabled to destructured props
  active,
}: ButtonProps) => {
  return (
    <button
      className={
        active
          ? `bg-[#1b60e9] p-[10px] w-full rounded-[8px] text-[#fff] flex justify-center`
          : `bg-[#676767] p-[10px] w-full rounded-[8px] text-[#fff] flex justify-center`
      }
      key={key}
      onClick={onClick}
      disabled={loading || disabled} // {{ edit_3 }} Updated to disable button if loading or disabled is true
      type={type as "submit" | "reset" | "button"}
    >
      {loading ? (
        <div className="border-4 border-white border-t-[#000] rounded-full w-5 h-5 animate-spin"></div>
      ) : (
        text
      )}
    </button>
  );
};
