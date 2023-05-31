# loa
copilot of data science.

## API
vars
dist view data

patterns
clusters
clusters on var
clusters on *var

var -> action:
- stat
- dist
- trans
    - filter
    - map

- var
    - var with data interesting
    - var with knowledge
    - var creation with filters ?
- algebra (* / +)
    - var relation 
        - cramer high / (auto | HCI)
        - cramer low * (auto | HCI)
        - + same domain (knowledge | HCI)
- scale
    - dist dense based
- stat
- geo
- coord (limited) knwoledg
    - geo gis
    - 
- encoding

大部分分析目标下，是特定目的的结合和数值。

但是由于获取到信息后可能会有转化需求，这个转化需求往往不是无中生有的。而是基于当前context的，所以context上的一些复杂环节会再次暴漏给用户，帮助用户看到其他的转化可能，以及关联的视图（graphscape）。

这里既可以使用predictive interaction 也可以使用直接的interaction。

所以产品设计的时候无需直接把gog的完整dsl暴漏给用户。HCI并不应当是简单的DSL的子集与自动化。而是一个把其中一些环节进行一定程度的自动化，一级default value，来降低用户思考的复杂度。仅仅在用户需要考虑深层复杂度的情况下，才会把相关的特性暴露的给用户。
