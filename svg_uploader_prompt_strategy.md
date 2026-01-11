# 📋 SVG Uploader - AI Prompting Strategy

## Initial Project Prompt (5 דקות)

```
Create a React application for uploading and managing SVG files with the following requirements:

FEATURES:
- Drag & drop SVG file upload
- Click to browse and upload
- Display uploaded SVGs in a grid
- Download individual SVGs
- Delete uploaded files
- Responsive design

TECHNICAL REQUIREMENTS:
- React with Hooks (no class components)
- TypeScript for type safety
- Clean Code principles
- Modern ES6+ syntax
- Component composition
- Custom hooks for reusable logic

STRUCTURE:
- Create separate components for: FileUpload, SVGPreview, SVGGrid
- Use custom hook for upload logic
- Implement proper error handling
- Add file validation (only SVG files, max size)

STYLING:
- Use Tailwind CSS
- Modern, clean UI
- Clear visual feedback for drag & drop
```

## Clean Code Refinement Prompt (10 דקות)

```
Review the code and apply these Clean Code principles:

1. SINGLE RESPONSIBILITY:
   - Each component should do ONE thing
   - Extract logic into custom hooks
   - Separate business logic from UI

2. MEANINGFUL NAMES:
   - Use descriptive variable names
   - Function names should describe what they do
   - Avoid abbreviations

3. DRY (Don't Repeat Yourself):
   - Extract repeated code into functions
   - Create reusable components
   - Use constants for magic numbers/strings

4. SMALL FUNCTIONS:
   - Keep functions under 20 lines
   - Each function should do one thing
   - Extract complex conditions into named functions

5. PROPER ERROR HANDLING:
   - Add try-catch blocks
   - Show user-friendly error messages
   - Validate inputs before processing
```

## Hooks Best Practices Prompt (10 דקות)

```
Refactor the React hooks according to these best practices:

1. CUSTOM HOOKS:
   - Create `useSVGUpload` hook for upload logic
   - Extract file validation into `useFileValidator`
   - Separate concerns into dedicated hooks

2. DEPENDENCY ARRAYS:
   - Ensure all useEffect dependencies are listed
   - Use useCallback for functions passed as dependencies
   - Use useMemo for expensive calculations

3. STATE MANAGEMENT:
   - Keep state as local as possible
   - Don't duplicate state
   - Use proper state initialization

4. AVOID COMMON MISTAKES:
   - Don't call hooks conditionally
   - Clean up effects (remove event listeners, cancel requests)
   - Use functional updates for state based on previous state

5. PERFORMANCE:
   - Memoize components when needed (React.memo)
   - Use useCallback for event handlers
   - Lazy load components if needed
```

## ES6+ Modernization Prompt (5 דקות)

```
Modernize the code using ES6+ features:

1. Arrow Functions - for all function expressions
2. Destructuring - for props and state
3. Spread Operator - for arrays and objects
4. Template Literals - for string interpolation
5. Optional Chaining - for safe property access
6. Nullish Coalescing - instead of || for default values
7. Array Methods - map, filter, reduce instead of loops
8. Async/Await - instead of promise chains
9. Modules - proper import/export syntax
10. Const/Let - never use var
```

## Final Polish Prompt (5 דקות)

```
Final review and polish:

1. Add TypeScript types for all props and state
2. Add comments only where necessary (code should be self-documenting)
3. Ensure consistent formatting
4. Add accessibility (aria labels, keyboard navigation)
5. Test edge cases (empty state, errors, large files)
6. Add loading states
7. Optimize bundle size
```
