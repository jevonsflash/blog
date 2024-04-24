---
thumbnail:
cover:
title: '在EF Core中为数据表按列加密存储'
excerpt:
description:
date: 2023-04-05 08:30:00
tags:
  - EFCore
  - 数据库
  - asp.net core
  - sqlserver

categories:
  - .NET
  - Database
 
toc: true
recommend: 1
keywords: categories-java
uniqueId: 2023-04-05 08:30:00/在EF Core中为数据表按列加密存储.html
---
假设有User表
```csharp
public class User : Entity<int>
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string Name { get; set; }
    public string IdentificationNumber { get; set; }
}
```
其中有身份证号码IdentificationNumber列，需要加密存储，该如何实现？

![在这里插入图片描述](644861-20230408184702342-729182384.png)


创建一个值转换器，继承`ValueConverter<TModel, string>`类型。其中泛型`TModel`为实体中属性的类型。

转换器将实体中属性类型，通过AES加密算法，转换为Base64编码字符串类型，存储到数据库中。当从数据库中读取数据时，再通过AES解密算法，将Base64编码字符串类型转换为实体中属性类型。

若实体类型为`byte[]`，则不需要转换为Base64编码字符串类型，直接对二进制数据进行加密和解密。此转换器可以用于加密存储图片、文件等二进制数据。

AES加密算法是一种对称加密算法，加密和解密使用相同的密钥。在加密和解密时，需要指定密钥、初始向量、盐值等参数。在转换器中，将这些参数设置为静态属性，方便在使用时，进行修改。


代码如下：
```csharp
public class EncryptionConverter<TModel> : ValueConverter<TModel, string>
{

    public const int DefaultKeysize = 256;

    public static string DefaultPassPhrase { get; set; }

    public static byte[] DefaultInitVectorBytes { get; set; }

    public static byte[] DefaultSalt { get; set; }
    public EncryptionConverter()
        : base(
            x => Encrypt(x),
            x => Decrypt(x))
    {
        DefaultPassPhrase = "gsKnGZ041HLL4IM8";
        DefaultInitVectorBytes = Encoding.ASCII.GetBytes("jkE49230Tf093b42");
        DefaultSalt = Encoding.ASCII.GetBytes("hgt!16kl");
    }

    private static string Encrypt(TModel input)
    {
        try
        {
            byte[] inputData = input switch
            {
                string => Encoding.UTF8.GetBytes(input.ToString()),
                byte[] => input as byte[],
                _ => null,
            };

            using (var password = new Rfc2898DeriveBytes(DefaultPassPhrase, DefaultSalt))
            {
                var keyBytes = password.GetBytes(DefaultKeysize / 8);
                using (var symmetricKey = Aes.Create())
                {
                    symmetricKey.Mode = CipherMode.CBC;
                    using (var encryptor = symmetricKey.CreateEncryptor(keyBytes, DefaultInitVectorBytes))
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                            {
                                cryptoStream.Write(inputData, 0, inputData.Length);
                                cryptoStream.FlushFinalBlock();
                                var cipherTextBytes = memoryStream.ToArray();
                                var rawString = Convert.ToBase64String(cipherTextBytes);
                                return rawString;

                            }
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {              
            LogHelper.LogException(ex);
            return input.ToString();              
        }
        
    }

    private static TModel Decrypt(string input)
    {
        try
        {
            var cipherTextBytes = Convert.FromBase64String(input);

            using (var password = new Rfc2898DeriveBytes(DefaultPassPhrase, DefaultSalt))
            {
                var keyBytes = password.GetBytes(DefaultKeysize / 8);
                using (var symmetricKey = Aes.Create())
                {
                    symmetricKey.Mode = CipherMode.CBC;
                    using (var decryptor = symmetricKey.CreateDecryptor(keyBytes, DefaultInitVectorBytes))
                    {
                        using (var memoryStream = new MemoryStream(cipherTextBytes))
                        {
                            using (var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                            {
                                var plainTextBytes = new byte[cipherTextBytes.Length];
                                int totalDecryptedByteCount = 0;
                                while (totalDecryptedByteCount < plainTextBytes.Length)
                                {
                                    var decryptedByteCount = cryptoStream.Read(
                                        plainTextBytes,
                                        totalDecryptedByteCount,
                                        plainTextBytes.Length - totalDecryptedByteCount
                                    );

                                    if (decryptedByteCount == 0)
                                    {
                                        break;
                                    }

                                    totalDecryptedByteCount += decryptedByteCount;
                                }
                                byte[] outputData = null;
                                if (typeof(TModel) == typeof(string))
                                  {
                                      var outputData = Encoding.UTF8.GetString(plainTextBytes, 0, totalDecryptedByteCount);
                                      return (TModel)Convert.ChangeType(outputData, typeof(TModel));

                                  }
                                  else if (typeof(TModel) == typeof(byte[]))
                                  {
                                      var outputData = plainTextBytes as byte[];
                                      return (TModel)Convert.ChangeType(outputData, typeof(TModel));

                                  };
                                  return default; 

                            }
                        }
                    }
                }
            }

        }
        catch (Exception ex)
        {
        	// 记录异常
            // LogHelper.LogException(ex);
            return (TModel)Convert.ChangeType(input, typeof(TModel));
        }

    }
}

```

在`DbContext`中，重写`OnModelCreating`方法，为User表的IdentificationNumber列，添加值转换器。
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    modelBuilder.Entity<User>().Property(c => c.IdentificationNumber).HasConversion<EncryptionConverter<string>>();
}

```


再次调用Add方法插入数据时，可以看到IdentificationNumber列已被加密了

![在这里插入图片描述](644861-20230408184702537-761925985.png)
