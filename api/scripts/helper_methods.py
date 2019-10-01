# helper method for printing stuff
def pretty_print_POST(req) -> None:
    print('{}\n{}\n{}\n\n{}'.format(
        '-----------START-----------',
        req.method + ' ' + req.url,
        '\n'.join('{}: {}'.format(k, v) for k, v in req.headers.items()),
        req.body,
    ))


# prints it in the order shown above
def prettyPrint(assignments) -> None:
    for i in range(1, 26):
        start = (i - 1) * 15
        end = start + 15
        print(' '.join(assignments[start:end]))
