with open('js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()

def check_js_syntax(js):
    i = 0
    line = 1
    col = 1
    state_stack = ['NORMAL']
    brace_stack = []
    
    while i < len(js):
        c = js[i]
        state = state_stack[-1]
        
        # Track line/col
        if c == '\n':
            line += 1
            col = 1
        else:
            col += 1
            
        if state == 'NORMAL':
            if c == '/' and i + 1 < len(js) and js[i+1] == '/':
                state_stack.append('IN_LINE_COMMENT')
                i += 1
            elif c == '/' and i + 1 < len(js) and js[i+1] == '*':
                state_stack.append('IN_BLOCK_COMMENT')
                i += 1
            elif c == '\'':
                state_stack.append('IN_SINGLE')
            elif c == '\"':
                state_stack.append('IN_DOUBLE')
            elif c == '`':
                state_stack.append('IN_TPL')
            elif c == '{':
                brace_stack.append(('{', line, col))
            elif c == '}':
                if not brace_stack:
                    print(f'Error: Unexpected closing brace }} at line {line}, col {col}')
                    return
                brace_type, bl, bc = brace_stack.pop()
                if brace_type == '${':
                    # We were inside a template literal expression, return to template mode
                    if state_stack[-1] == 'NORMAL':
                        state_stack.pop() # Pop NORMAL state
        elif state == 'IN_LINE_COMMENT':
            if c == '\n':
                state_stack.pop()
        elif state == 'IN_BLOCK_COMMENT':
            if c == '*' and i + 1 < len(js) and js[i+1] == '/':
                state_stack.pop()
                i += 1
        elif state == 'IN_SINGLE':
            if c == '\\':
                i += 1
            elif c == '\'':
                state_stack.pop()
            elif c == '\n':
                print(f'Error: Unclosed single quote at line {line}, col {col}')
                return
        elif state == 'IN_DOUBLE':
            if c == '\\':
                i += 1
            elif c == '\"':
                state_stack.pop()
            elif c == '\n':
                print(f'Error: Unclosed double quote at line {line}, col {col}')
                return
        elif state == 'IN_TPL':
            if c == '\\':
                i += 1
            elif c == '`':
                state_stack.pop()
            elif c == '$' and i + 1 < len(js) and js[i+1] == '{':
                brace_stack.append(('${', line, col))
                i += 1
                state_stack.append('NORMAL')
        i += 1
        
    if brace_stack:
        print('Unclosed brackets/templates left on stack:')
        for s, l, cl in brace_stack[-10:]:
            print(f'Unclosed {s} starting at line {l}, col {cl}')
    elif len(state_stack) > 1:
        print(f'Unclosed states: {state_stack[1:]}')
    else:
        print('Tokens and braces successfully matched!')

check_js_syntax(js)
