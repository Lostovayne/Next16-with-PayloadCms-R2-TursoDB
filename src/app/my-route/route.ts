export const GET = async (_request: Request) => {
  return Response.json({
    message: 'This is an example of a custom route.',
  });
};
