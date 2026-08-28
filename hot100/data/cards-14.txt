    while True:
        s=a[s];f=a[a[f]]
        if s==f:break
    s=a[0]
    while s!=f:s=a[s];f=a[f]
    return s
```