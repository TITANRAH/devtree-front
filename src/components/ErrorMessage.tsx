interface Props {
  children: React.ReactNode;
}

function ErrorMessage(props: Props) {
  const { children } = props;
  return <p className="bg-red-100 flex uppercase p-2 text-sm items-center justify-center rounded-sm text-red-600">{children}</p>;
}

export default ErrorMessage;
