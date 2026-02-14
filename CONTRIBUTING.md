# Contributing to Genius Team

Thank you for your interest in contributing to Genius Team!

## How to Contribute

### Reporting Issues

1. Check existing issues first
2. Include Claude Code version (`claude --version`)
3. Include Genius Team version (8.0.0)
4. Provide steps to reproduce

### Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test with `/genius-start`
5. Submit a pull request

### Skill Development

When creating or modifying skills:

1. Follow the SKILL.md format with YAML frontmatter
2. Include Memory Integration section
3. Include Sharp Edges section
4. Include Handoffs section
5. Test with Claude Code 2.1+

### Code Style

- Use descriptive names
- Keep skills focused (single responsibility)
- Document all handoffs between skills
- Use the hydration pattern for task persistence

## Questions?

Open an issue or check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).
