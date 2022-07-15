function ErrorLabel(props: { message: string }) {
  return <div className="text-xs font-bold text-red-500">{props.message}</div>;
}

export default ErrorLabel;
